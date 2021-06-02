import axios from 'axios'

const Api=axios.create({
    baseURL: 'https://young-bayou-49970.herokuapp.com/api' 
});

export default Api;