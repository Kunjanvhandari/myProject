import { pdfjs } from "react-pdf";
console.log("pdfjs version:", pdfjs.version);
console.log("has GlobalWorkerOptions:", !!pdfjs.GlobalWorkerOptions);
console.log("workerSrc before:", pdfjs.GlobalWorkerOptions?.workerSrc);

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
console.log("workerSrc after:", pdfjs.GlobalWorkerOptions.workerSrc);
console.log("Success!");
