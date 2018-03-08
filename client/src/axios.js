import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://mundial-predictor-pilot.herokuapp.com',
});

// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

export default instance;
