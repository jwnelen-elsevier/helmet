const ModelCard = ({ model }) => {
  const { givenname, modelname, task } = model;

  if (!givenname) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">No Model Loaded</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <h1>Model details</h1>
        {givenname && <h5 className="card-title">Given Name: {givenname}</h5>}
        {modelname && <h5 className="card-title">Model Name: {modelname}</h5>}
        {task && <h5 className="card-title">Task: {task}</h5>}
      </div>
    </div>
  );
};

export default ModelCard;
