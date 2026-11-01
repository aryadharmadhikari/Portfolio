import { useEffect, useState } from "react";
import { getRecords } from "./api.js";

export default function useCollection(resource) {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    getRecords(resource)
      .then((data) => {
        if (active) {
          setRecords((current) => [...current, ...data.filter((record) => !current.some((item) => item._id === record._id))]);
          setStatus("ready");
        }
      })
      .catch(() => { if (active) setStatus((current) => current === "ready" ? current : "error"); });
    return () => { active = false; };
  }, [resource]);

  function addRecord(record) {
    setRecords((current) => [record, ...current]);
    setStatus("ready");
  }

  return { records, status, addRecord };
}
