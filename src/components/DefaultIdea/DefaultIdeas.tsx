import DefaultIdea from "./DefaultIdea";

const defaultIdeas = [
  {
    idea: "What's the market doing today?",
    moreContext: "Give a summary of today's stock market trends and major index movements.",
  },
  {
    idea: "Top gainers and losers",
    moreContext: "List the top gaining and losing stocks in today's market session.",
  },
  {
    idea: "Should I invest in tech stocks?",
    moreContext: "Analyze whether tech stocks are a good investment right now based on market data.",
  },
  {
    idea: "Global market news",
    moreContext: "Summarize the latest global financial news affecting stock markets and currencies.",
  },
];

export default function DefaultIdeas({ visible = true }) {
  return (
    <div className={`row1 ${visible ? "block" : "hidden"}`}>
      <DefaultIdea ideas={defaultIdeas.slice(0, 2)} />
      <DefaultIdea
        ideas={defaultIdeas.slice(2, 4)}
        myclassNames="hidden md:visible"
      />
    </div>
  );
}
