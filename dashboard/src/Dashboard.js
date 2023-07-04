function Dashboard()    {
    return(
        <iframe title="Dashboard" frameBorder="0" src={process.env.REACT_APP_KIBANA_IFRAME} width="100%" height="100%"></iframe>
    )
}

export default Dashboard;