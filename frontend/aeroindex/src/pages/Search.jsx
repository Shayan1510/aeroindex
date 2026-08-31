import SearchPanel from "../components/SearchPanel.jsx";

export default function Search() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
      <h1 className="font-display text-3xl font-semibold mb-2">Search flights</h1>
      <p className="text-sm text-ink-mute dark:text-ink-darkMute mb-8">
        Compare fares across airlines and see how each price stacks up against the route's recent history.
      </p>
      <SearchPanel />
    </div>
  );
}
