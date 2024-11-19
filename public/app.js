// public/app.js
const App = () => {
  const [currentView, setCurrentView] = React.useState('stats');

  const renderView = () => {
    switch(currentView) {
      case 'stats':
        return <GetStatsIris />;
      case 'add':
        return <AddIris />;
      case 'update':
        return <UpdateIris />;
      case 'delete':
        return <DeleteIris />;
      default:
        return <GetStatsIris />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex space-x-4">
        <button 
          onClick={() => setCurrentView('stats')} 
          className={`btn ${currentView === 'stats' ? 'btn-primary' : 'bg-gray-500'}`}
        >
          View Stats
        </button>
        <button 
          onClick={() => setCurrentView('add')} 
          className={`btn ${currentView === 'add' ? 'btn-primary' : 'bg-gray-500'}`}
        >
          Add Iris
        </button>
        <button 
          onClick={() => setCurrentView('update')} 
          className={`btn ${currentView === 'update' ? 'btn-primary' : 'bg-gray-500'}`}
        >
          Update Iris
        </button>
        <button 
          onClick={() => setCurrentView('delete')} 
          className={`btn ${currentView === 'delete' ? 'btn-primary' : 'bg-gray-500'}`}
        >
          Delete Iris
        </button>
      </div>
      {renderView()}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
