// App.jsx (with responsive design)
import { useState } from "react";
import { Loader } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import { toast } from "react-toastify";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const amplifyClient = generateClient<Schema>({
  authMode: "userPool",
});

function App() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string>("");

  const handleGenerate = async () => {
    if (!ingredients || ingredients.trim().length === 0) {
      toast.error("Please enter some ingredients to generate a recipe");
      return;
    }

    if (ingredients.split(",").length > 10) {
      toast.error("Please enter no more than 10 ingredients");
      return;
    }

    setLoading(true);
    setError(null);
    setResult("");

    try {
      const { data, errors } = await amplifyClient.queries.askBedrock({
        ingredients: [ingredients],
      });

      if (errors) {
        throw new Error(errors[0]?.message || "Failed to generate recipe");
      }

      if (!data?.body) {
        throw new Error("No recipe generated");
      }

      setResult(data.body);
      toast.success("Recipe generated successfully!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIngredients(e.target.value);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success("Recipe copied to clipboard!");
  };

  return (
    <>
      <div className="app-container">
        <div className="header-container">
          <h1 className="main-header">
            Meet Your Personal
            <br />
            <span className="highlight">Recipe AI</span>
          </h1>
          <p className="description">
            Simply type a few ingredients (up to 10) using the format:
            <span className="format-example"> ingredient1, ingredient2</span>
            and Recipe AI will generate an all-new recipe on demand...
          </p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="form-container">
          <div className="search-container">
            <input
              type="text"
              className="wide-input"
              id="ingredients"
              name="ingredients"
              placeholder="Enter ingredients separated by commas..."
              value={ingredients}
              onChange={onInputChange}
              disabled={loading}
              maxLength={200}
            />
            <div className="button-container">
              <button
                type="button"
                className="search-button"
                onClick={handleGenerate}
                disabled={loading || !ingredients}
              >
                {loading ? (
                  <span className="loading-button">
                    <span className="spinner"></span>
                    Generating...
                  </span>
                ) : (
                  "Generate"
                )}
              </button>
              <button
                type="button"
                className="clear-button"
                onClick={() => {
                  setIngredients("");
                  setResult("");
                  setError(null);
                }}
                disabled={loading || !ingredients}
              >
                Clear
              </button>
            </div>
          </div>
        </form>
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button
              className="retry-button"
              onClick={handleGenerate}
              disabled={loading}
            >
              Try Again
            </button>
          </div>
        )}
        {result && (
          <div className="result-container">
            <div className="result-header">
              <h2>Your Custom Recipe</h2>
              <button
                className="copy-button"
                onClick={copyToClipboard}
                title="Copy to clipboard"
              >
                📋
              </button>
            </div>
            <pre className="result-content">{result}</pre>
          </div>
        )}
        {loading && !error && (
          <div className="loader-container">
            <Loader size="large" />
            <p className="loading-text">Generating your recipe...</p>
          </div>
        )}
        // footer
      </div>
      <div className="footer">
        <p>👾 Made with love by David C and AWS</p>
      </div>
    </>
  );
}

export default App;
