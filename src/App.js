import { useState } from "react";
import * as XLSX from "xlsx";

function App() {


  // onChange estados:

  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);

  // submit estado:
  const [excelData, setExcelData] = useState(null);

  // onChange evento:
  const handlefile=(e)=> {
    let fileTypes=[
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile=e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload=(e)=>{
          setExcelFile(e.target.result);
        };
      } 
      else {
        setTypeError("Por favor selecione apenas arquivos de excel ou txt");
        setExcelFile(null);
      }
    } 
    else {
      console.log("Por favor Selecione seu arquivo");
    }
  }

  // submit evento
  const handlefileSubmit=(e)=>{
    e.preventDefault();
    if(excelFile!==null){
      const workbook = XLSX.read(excelFile,{type: 'buffer'});
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data.slice(0,10));
    }
  }

  return (
    <div className="wrapper">

      <h3 className="titulo">Carregar e visualizar planilhas do Excel</h3>

      {/* Form */}
      <form className="form-group custom-form " onSubmit={handlefileSubmit}>
        <input
          type="file"
          className="form-control"
          requeried
          onChange={handlefile}
        />
        <button type="submit" className="btn btn-sucess btn-md">CARREGAR</button>
        {typeError&&(
          <div className="alert alert-danger custom-error" role="alert">{typeError}</div>
        )}
      </form>

      {/* View data */}
      <div className="viewer">
        {excelData?(
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(excelData[0]).map((key)=>(
                  <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((individualExcelData, index)=>(
                    <tr key={index}>
                      {Object.keys(individualExcelData).map((key)=>(
                        <td key={key}>{individualExcelData[key]}</td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>Nenhum arquivo foi carregado.</div>
        )}
      </div>
    </div>
  );
}

export default App;
