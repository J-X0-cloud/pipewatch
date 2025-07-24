import { Fragment } from "react";
import { PLAN_COMPARISON, PLANS, type Cell } from "@/lib/data/pricing";

function CellValue({ value }: { value: Cell }) {
  if (value === true) return <span className="yes">✓</span>;
  if (value === false) return <span className="no">—</span>;
  return <>{value}</>;
}

export function CompareTable() {
  return (
    <div className="table-scroll">
      <table className="compare">
        <thead>
          <tr>
            <th>Feature</th>
            {PLANS.map((plan) => (
              <th key={plan.name}>{plan.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PLAN_COMPARISON.map(({ group, rows }) => (
            <Fragment key={group}>
              <tr className="grp">
                <td colSpan={PLANS.length + 1}>{group}</td>
              </tr>
              {rows.map(([feature, ...cells]) => (
                <tr key={feature}>
                  <td>{feature}</td>
                  {cells.map((cell, i) => (
                    <td key={i}>
                      <CellValue value={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
