import { type DataRow } from "../types";
import datetimeToLocalTime from "../utils/datetimeToLocalTime";
import vowelFilter from "../utils/vowelFilter";
import "./table.css";

interface TableProps {
  data: DataRow[];
  vowelFilterEnabled: boolean;
  onRowClick: (row: DataRow) => void;
}

export default function Table({
  data,
  vowelFilterEnabled,
  onRowClick,
}: TableProps) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        {data
          .filter(
            (row) => !vowelFilterEnabled || (row.data && vowelFilter(row.data))
          )
          .map((row, index) => (
            <tr key={index} onClick={() => onRowClick(row)}>
              <td>{datetimeToLocalTime(row.timeStamp)}</td>
              <td>{row.data?.join(", ")}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
