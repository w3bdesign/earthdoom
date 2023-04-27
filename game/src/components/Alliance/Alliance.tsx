const Alliance = () => {
  return (
    <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-900">
      <div className="relative py-4 sm:mx-auto">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Alliance</span>
            </h1>
            <div className="flex flex-col">
              <label htmlFor="inputField" className="mb-1 text-sm font-medium">
                Enter letters only:
              </label>
              <input
                id="inputField"
                type="text"
                pattern="[A-Za-z]+"
                title="Please enter letters only"
                aria-describedby="inputFieldHelp"
                className="rounded-md border border-gray-300 p-2 text-sm"
              />
              <small id="inputFieldHelp" className="mt-1 text-xs text-gray-600">
                This field accepts letters only
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alliance;
