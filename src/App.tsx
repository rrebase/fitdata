import React from "react";
import "./App.scss";
import { Provider } from "react-redux";
import store from "./store";
import FileInput from "features/file/FileInput";
import Results from "features/results/Results";
import Papa, { ParseResult } from "papaparse";
import { Row } from "features/results/Results";
import { saveState, loadState } from "utils/localStorage";

const App: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [rows, setRows] = React.useState<Row[]>([]);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    setRows(loadState() || []);
  }, []);

  const handleResults = (result: ParseResult) => {
    const finalRows: Row[] = [];
    const rawRows = result.data;

    for (let i = 1; i < rawRows.length; i++) {
      const [
        date,
        exercise,
        reps,
        weight,
        duration,
        distance,
        incline,
        resistance,
        isWarmup,
        note
      ] = rawRows[i];
      // Apparently there can be empty rows, ignore those
      if (!date) {
        continue;
      }
      finalRows.push({
        date: date.replace(/ \+\d+/g, "").replace(/ /g, "T"),
        exercise,
        reps: parseFloat(reps),
        weight: parseFloat(weight),
        duration: parseFloat(duration),
        distance: parseFloat(distance),
        incline: parseFloat(incline),
        resistance: parseFloat(resistance),
        isWarmup,
        note
      });
    }
    setRows(finalRows);
    saveState(finalRows);
  };

  const handleFileInputChange = (files: File[]) => {
    try {
      setFiles(files);
      const file = files[0];
      Papa.parse(file, {
        complete: handleResults
      });
    } catch (e) {
      setError(`Error: ${e}`);
    }
  };

  return (
    <Provider store={store}>
      <div className="App">
        <div className="container">
          <svg
            width="56"
            height="42"
            viewBox="0 0 56 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M54.6875 35C55.4094 35 56 35.5906 56 36.3125V40.6875C56 41.4094 55.4094 42 54.6875 42H1.3125C0.590625 42 0 41.4094 0 40.6875V1.3125C0 0.590625 0.590625 0 1.3125 0H5.6875C6.40937 0 7 0.590625 7 1.3125V35H54.6875ZM40.7641 10.4453L31.5 16.625L22.1703 4.18906C21.6125 3.44531 20.475 3.5 19.9938 4.29844L10.5 20.125V31.5H52.5L42.6672 10.9594C42.3172 10.2484 41.4203 10.0078 40.7641 10.4453V10.4453Z"
              fill="#E9AA52"
            />
          </svg>
          <h1 className="name">FitData</h1>
          <FileInput value={files} onChange={handleFileInputChange} />
          {error && <div className="error">{error}</div>}
          {rows.length > 0 && <Results rows={rows} />}
        </div>
      </div>
    </Provider>
  );
};

export default App;
