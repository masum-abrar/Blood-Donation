import axios from "axios";

const axiosPublic = axios.create({
    baseURL: 'https://blood-donation-server-sandy.vercel.app/'
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;
