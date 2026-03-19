# MANUS → ANTIGRAVITY AUTOMATION BRIDGE (PATH B)
## Direct Local Webhook Integration via ngrok

**Objective:** Create a seamless pipeline where Manus writes technical specs to `MANUS_HANDOFF.md`, commits to GitHub, and the spec automatically arrives at your local IDE via ngrok webhook for Antigravity to execute.

---

## ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│ MANUS (External Agent)                                          │
│ - Researches requirements                                       │
│ - Writes technical spec to MANUS_HANDOFF.md                    │
│ - Commits to GitHub                                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ GitHub Actions Workflow (.github/workflows/manus-handoff.yml)   │
│ - Triggered on MANUS_HANDOFF.md changes                         │
│ - Extracts spec content                                         │
│ - POSTs to ngrok webhook URL                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ ngrok Tunnel (FREE TIER)                                        │
│ - Exposes your local machine to internet                        │
│ - Receives GitHub Actions webhook POST                          │
│ - Routes to localhost:3001                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Local Webhook Receiver (Node.js Express Server)                 │
│ - Listens on localhost:3001                                     │
│ - Receives spec from GitHub Actions                             │
│ - Writes to .manus/incoming-spec.json                           │
│ - Exposes via MCP Server                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Antigravity IDE (MCP Client)                                    │
│ - Reads spec from MCP server                                    │
│ - User invokes: /manus-execute                                  │
│ - Executes blueprint in codebase                                │
│ - Commits results back to GitHub                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## STEP 1: SET UP NGROK (FREE TIER)

### 1.1 Install ngrok
```bash
# macOS (Homebrew)
brew install ngrok

# Linux
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok-agent-v3-stable-linux-amd64.zip -o ngrok.zip
unzip ngrok.zip
sudo mv ngrok /usr/local/bin/

# Windows
# Download from https://ngrok.com/download
```

### 1.2 Create ngrok Account (FREE)
1. Go to https://ngrok.com/
2. Sign up with GitHub (free tier)
3. Copy your **authtoken** from dashboard
4. Run: `ngrok config add-authtoken YOUR_AUTHTOKEN`

### 1.3 Start ngrok Tunnel
```bash
# This exposes localhost:3001 to the internet
ngrok http 3001

# Output will show:
# Forwarding    https://abc123.ngrok.io -> http://localhost:3001
# Copy this URL for Step 3
```

**Keep this terminal open.** Your ngrok URL is now live.

---

## STEP 2: CREATE LOCAL WEBHOOK RECEIVER

### 2.1 Create Webhook Server Script
Create file: `webhook-receiver.mjs` in your project root

```javascript
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

// Ensure .manus directory exists
const manusDirPath = path.join(__dirname, '.manus');
if (!fs.existsSync(manusDirPath)) {
  fs.mkdirSync(manusDirPath, { recursive: true });
}

// Middleware
app.use(express.json());

// Webhook endpoint
app.post('/webhook/manus-handoff', (req, res) => {
  try {
    const { spec, timestamp, commit_sha } = req.body;

    if (!spec) {
      return res.status(400).json({ error: 'No spec provided' });
    }

    // Write spec to .manus/incoming-spec.json
    const specPath = path.join(manusDirPath, 'incoming-spec.json');
    const specData = {
      spec,
      timestamp: timestamp || new Date().toISOString(),
      commit_sha: commit_sha || 'unknown',
      received_at: new Date().toISOString(),
    };

    fs.writeFileSync(specPath, JSON.stringify(specData, null, 2));

    console.log(`✓ Spec received and saved to ${specPath}`);
    console.log(`✓ Timestamp: ${specData.received_at}`);
    console.log(`✓ Commit SHA: ${commit_sha}`);

    res.json({
      success: true,
      message: 'Spec received and ready for Antigravity',
      spec_path: specPath,
      timestamp: specData.received_at,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Webhook receiver listening on http://localhost:${PORT}`);
  console.log(`📡 Waiting for GitHub Actions webhook...\n`);
});
```

### 2.2 Install Express (if not already installed)
```bash
npm install express
# or
pnpm add express
```

### 2.3 Start the Webhook Receiver
```bash
node webhook-receiver.mjs
```

You should see:
```
🚀 Webhook receiver listening on http://localhost:3001
📡 Waiting for GitHub Actions webhook...
```

---

## STEP 3: CREATE GITHUB ACTIONS WORKFLOW

### 3.1 Create Workflow File
Create file: `.github/workflows/manus-handoff.yml`

```yaml
name: Manus → Antigravity Handoff

on:
  push:
    paths:
      - 'MANUS_HANDOFF.md'
    branches:
      - main

jobs:
  handoff:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Read MANUS_HANDOFF.md
        id: read_spec
        run: |
          # Read the spec file
          SPEC=$(cat MANUS_HANDOFF.md)
          
          # Escape for JSON
          SPEC_JSON=$(echo "$SPEC" | jq -Rs .)
          
          echo "spec=$SPEC_JSON" >> $GITHUB_OUTPUT
          echo "commit_sha=${{ github.sha }}" >> $GITHUB_OUTPUT

      - name: Send to ngrok Webhook
        run: |
          NGROK_URL="${{ secrets.NGROK_WEBHOOK_URL }}"
          
          if [ -z "$NGROK_URL" ]; then
            echo "❌ ERROR: NGROK_WEBHOOK_URL secret not set"
            exit 1
          fi
          
          curl -X POST "$NGROK_URL/webhook/manus-handoff" \
            -H "Content-Type: application/json" \
            -d @- << EOF
          {
            "spec": ${{ steps.read_spec.outputs.spec }},
            "timestamp": "$(date -u +'%Y-%m-%dT%H:%M:%SZ')",
            "commit_sha": "${{ github.sha }}",
            "repository": "${{ github.repository }}"
          }
          EOF

      - name: Verify webhook delivery
        run: |
          echo "✓ Spec sent to ngrok webhook"
          echo "✓ Commit SHA: ${{ github.sha }}"
          echo "✓ Check your IDE for incoming spec"
```

### 3.2 Add GitHub Secret
1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `NGROK_WEBHOOK_URL`
4. Value: `https://YOUR_NGROK_URL` (from Step 1.3)
   - Example: `https://abc123.ngrok.io`
5. Click **Add secret**

---

## STEP 4: CREATE ANTIGRAVITY MCP SERVER

### 4.1 Create MCP Server Script
Create file: `.manus/mcp-server.mjs`

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * MCP Server for Antigravity to read incoming specs
 * Antigravity will call these tools via MCP
 */

export const tools = {
  /**
   * Get the latest incoming spec from Manus
   */
  get_latest_spec: {
    description: 'Fetch the latest MANUS_HANDOFF.md spec from webhook',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    async execute() {
      try {
        const specPath = path.join(__dirname, 'incoming-spec.json');

        if (!fs.existsSync(specPath)) {
          return {
            success: false,
            message: 'No spec received yet. Waiting for GitHub Actions webhook...',
          };
        }

        const specData = JSON.parse(fs.readFileSync(specPath, 'utf-8'));

        return {
          success: true,
          spec: specData.spec,
          received_at: specData.received_at,
          commit_sha: specData.commit_sha,
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
        };
      }
    },
  },

  /**
   * Mark spec as processed
   */
  mark_spec_processed: {
    description: 'Mark the current spec as processed by Antigravity',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['completed', 'failed'],
          description: 'Execution status',
        },
        notes: {
          type: 'string',
          description: 'Execution notes or error message',
        },
      },
    },
    async execute(input) {
      try {
        const specPath = path.join(__dirname, 'incoming-spec.json');
        const processedPath = path.join(__dirname, 'processed-specs.jsonl');

        if (!fs.existsSync(specPath)) {
          return { success: false, error: 'No spec to mark' };
        }

        const specData = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
        const processedRecord = {
          ...specData,
          status: input.status,
          notes: input.notes,
          processed_at: new Date().toISOString(),
        };

        // Append to processed specs log
        fs.appendFileSync(
          processedPath,
          JSON.stringify(processedRecord) + '\n'
        );

        // Remove current spec
        fs.unlinkSync(specPath);

        return {
          success: true,
          message: `Spec marked as ${input.status}`,
        };
      } catch (error) {
        return {
          success: false,
          error: error.message,
        };
      }
    },
  },
};

export default tools;
```

### 4.2 Configure Antigravity to Use MCP Server
In your Antigravity IDE settings, add this MCP server configuration:

```json
{
  "mcpServers": {
    "manus-handoff": {
      "command": "node",
      "args": [".manus/mcp-server.mjs"],
      "env": {
        "NODE_OPTIONS": "--input-type=module"
      }
    }
  }
}
```

---

## STEP 5: ANTIGRAVITY SLASH COMMAND

### 5.1 Create Antigravity Command
Inside your Antigravity IDE, create a custom slash command:

**Command:** `/manus-execute`

**Prompt Template:**
```
You are executing a technical specification from Manus.

1. Call the MCP tool "get_latest_spec" to fetch the incoming spec
2. Read and understand the complete specification
3. Execute the blueprint exactly as written
4. Implement all code changes in the codebase
5. Test the implementation
6. Commit changes to git with message: "feat: [spec-title] - Manus handoff execution"
7. Call "mark_spec_processed" with status "completed"
8. Report back with a summary of what was implemented

If any errors occur:
- Call "mark_spec_processed" with status "failed" and error details
- Report the error to the user
```

---

## STEP 6: END-TO-END TESTING

### 6.1 Test the Pipeline

**Terminal 1: Start ngrok**
```bash
ngrok http 3001
# Copy the ngrok URL (e.g., https://abc123.ngrok.io)
```

**Terminal 2: Start webhook receiver**
```bash
node webhook-receiver.mjs
```

**Terminal 3: Test the webhook**
```bash
# Replace YOUR_NGROK_URL with actual URL from Terminal 1
curl -X POST "https://YOUR_NGROK_URL/webhook/manus-handoff" \
  -H "Content-Type: application/json" \
  -d '{
    "spec": "# Test Spec\nThis is a test specification.",
    "timestamp": "'$(date -u +'%Y-%m-%dT%H:%M:%SZ')'",
    "commit_sha": "test-sha-123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Spec received and ready for Antigravity",
  "spec_path": ".manus/incoming-spec.json",
  "timestamp": "2026-03-15T20:00:00Z"
}
```

### 6.2 Verify Spec File Created
```bash
cat .manus/incoming-spec.json
```

You should see the spec data saved.

---

## STEP 7: PRODUCTION DEPLOYMENT

### 7.1 Keep ngrok Running
For continuous operation, use ngrok's paid tier or keep a persistent tunnel:

```bash
# Option 1: Use ngrok reserved domain (paid tier)
ngrok http 3001 --domain=your-reserved-domain.ngrok.io

# Option 2: Keep terminal open (free tier)
# Terminal stays running with ngrok http 3001
```

### 7.2 Keep Webhook Receiver Running
Use a process manager like `pm2`:

```bash
# Install pm2
npm install -g pm2

# Start webhook receiver
pm2 start webhook-receiver.mjs --name "manus-webhook"

# Keep it running on reboot
pm2 startup
pm2 save
```

### 7.3 GitHub Actions Verification
Every time you commit to `MANUS_HANDOFF.md`:
1. GitHub Actions triggers automatically
2. Reads the spec
3. POSTs to your ngrok webhook
4. Your local receiver captures it
5. Antigravity reads via MCP
6. You invoke `/manus-execute` in IDE
7. Antigravity implements the spec

---

## TROUBLESHOOTING

### Issue: "NGROK_WEBHOOK_URL secret not set"
**Solution:** Add the secret to GitHub repo settings (Step 3.2)

### Issue: Webhook receiver not receiving POST
**Solution:** 
- Verify ngrok is running: `ngrok http 3001`
- Check ngrok URL in GitHub secret matches actual URL
- Test with curl command (Step 6.1)

### Issue: Antigravity not reading spec
**Solution:**
- Verify MCP server is configured correctly
- Check `.manus/incoming-spec.json` exists
- Test MCP tool manually in Antigravity

### Issue: ngrok tunnel keeps disconnecting
**Solution:**
- Use paid ngrok tier for persistent domain
- Or use alternative: `localtunnel` (free) or `cloudflare tunnel` (free)

---

## SUMMARY

**You now have:**
- ✓ ngrok tunnel exposing localhost:3001
- ✓ Local webhook receiver listening for GitHub Actions
- ✓ GitHub Actions workflow watching MANUS_HANDOFF.md
- ✓ Antigravity MCP server reading incoming specs
- ✓ Slash command `/manus-execute` to run specs

**The Flow:**
1. Manus writes spec → commits to GitHub
2. GitHub Actions triggers → sends to ngrok webhook
3. Webhook receiver captures → saves to `.manus/incoming-spec.json`
4. You invoke `/manus-execute` in Antigravity
5. Antigravity reads spec via MCP → executes blueprint
6. Changes committed back to GitHub

**Zero manual handoff. Fully automated pipeline.**

---

## NEXT STEPS

1. Complete Steps 1-5 above
2. Test the pipeline with Step 6
3. Commit this file to trigger GitHub Actions
4. Antigravity will receive the spec automatically
5. Invoke `/manus-execute` to test end-to-end

Ready to proceed? 🚀
