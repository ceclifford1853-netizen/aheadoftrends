import React from "react";

const KofiWidget: React.FC<{ type: "button" | "shop" | "commission" }> = ({
  type,
}) => {
  const kofiPageUrl = "https://ko-fi.com/aheadoftrendsautomatedaiagents";

  if (type === "button") {
    return (
      <div className="flex justify-center my-8">
        <iframe
          src={`${kofiPageUrl}?hidefeed=true&widget=true&embed=true&preview=true`}
          height="712"
          style={{ border: "none", width: "100%", maxWidth: "500px" }}
          title="aheadoftrendsautomatedaiagents"
        />
      </div>
    );
  }

  if (type === "shop") {
    return (
      <div className="flex justify-center my-8">
        <a
          href={`${kofiPageUrl}?tab=shop`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
            Browse AEO Products
          </button>
        </a>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-8">
      <a
        href={`${kofiPageUrl}?tab=commissions`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700">
          Request AEO Audit
        </button>
      </a>
    </div>
  );
};

export default KofiWidget;
