import { observer } from "mobx-react-lite";
import { TableTop } from "./TableTop";
import { TableBase } from "./TableBase";
import {TableMDF} from "./TableMDF.tsx"

export const Table = observer(() => {

  return (
    <>
      <group name="Table">
        <TableTop />
        <TableMDF />
        <TableBase />
      </group>
    </>
    
  );
});
