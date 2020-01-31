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

  React.useEffect(() => {
    setRows(loadState() || []);
  }, []);

  const handleResults = (result: ParseResult) => {
    const finalRows: Row[] = [];
    const rawRows = result.data;
    console.log(rawRows);

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
      finalRows.push({
        date: date,
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
    setFiles(files);
    const file = files[0];
    Papa.parse(file, {
      complete: handleResults
    });
  };

  return (
    <Provider store={store}>
      <div className="App">
        <div className="container">
          <h1 className="name">FitData</h1>
          <FileInput value={files} onChange={handleFileInputChange} />
          {rows.length > 0 && <Results rows={rows} />}
        </div>
      </div>
    </Provider>
  );
};

export default App;
