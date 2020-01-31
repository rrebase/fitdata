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
    <label className={styles.label}>
      Open csv file
      <input
        {...rest}
        style={{ display: "none" }}
        type="file"
        onChange={e => {
          // @ts-ignore
          onChange([...e.target.files]);
        }}
      />
    </label>
    {Boolean(value.length) && (
      <div className={styles.selectedFiles}>
        Selected files: {value.map(f => f.name).join(", ")}
      </div>
    )}
  </div>
);

export default FileInput;
