import { useQuery } from "@tanstack/react-query";
import { useAxiosSecure } from "./useAxiosSecure";
import useAuth from "./useAuth";

export const UseVolunteer = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    
    const { data: isVolunteer, isLoading: isVolunteerLoading } = useQuery({
        queryKey: [user?.email, 'isVolunteer'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/volunteer/${user.email}`);
            console.log(res.data);
            return res.data?.volunteer;
        }
    });

    return [isVolunteer, isVolunteerLoading];
};


