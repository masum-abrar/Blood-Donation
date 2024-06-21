import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "./useAxiosSecure";
import useAuth from "./useAuth";

export const useDonor = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    
    const { data: isDonor, isLoading: isDonorLoading } = useQuery({
        queryKey: [user?.email, 'isDonor'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/donor/${user.email}`);
            console.log(res.data);
            return res.data?.donor;
        }
    });

    return [isDonor, isDonorLoading];
};


