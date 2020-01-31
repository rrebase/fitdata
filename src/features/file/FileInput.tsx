import React from "react";
import styles from "./FileInput.module.scss";

const noop = () => null;

interface FileInputProps {
  value: File[];
  onChange: any;
}

const FileInput: React.FC<FileInputProps> = ({
  value,
  onChange = noop,
  ...rest
}) => (
  <div>
    <div className={styles.fileInput}>
      <label className={styles.label}>
        Open csv file
        <input
          {...rest}
          style={{ display: "none" }}
          type="file"
          accept=".csv"
          onChange={e => {
            // @ts-ignore
            onChange([...e.target.files]);
          }}
        />
      </label>
    </div>
    {Boolean(value.length) && (
      <div className={styles.selectedFiles}>
        Selected file: {value.map(f => f.name).join(", ")}
      </div>
    )}
  </div>
);

export default FileInput;
