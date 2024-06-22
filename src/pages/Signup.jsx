import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from "../firebase/firebase.config";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { AuthContext } from "../providers/AuthProviders";
import { useContext, useEffect, useState } from "react";
import district from "../../public/District.json";
import upazila from "../../public/Upazila.json";
import axios from "axios"; 
import pic1 from '../assets/pic1.jpg'

export const Signup = () => {
    const axiosPublic = useAxiosPublic();
    const googleProvider = new GoogleAuthProvider();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useContext(AuthContext) || {};
    const navigate = useNavigate();
    
    // State to hold district and upazila options
    const [districtOptions, setDistrictOptions] = useState([]);
    const [upazilaOptions, setUpazilaOptions] = useState([]);
    const [avatarURL, setAvatarURL] = useState(''); // State to store uploaded avatar URL

    // Effect to set district options on component mount
    useEffect(() => {
        const districts = district.map(district => district.name);
        setDistrictOptions(districts);
    }, []);

    // Effect to set upazila options on component mount
    useEffect(() => {
        const upazilas = upazila.map(upazila => upazila.name);
        setUpazilaOptions(upazilas);
    }, []);

    // Function to handle avatar upload to ImageBB
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('key', 'abe0afd820806e4f1eb0a17d1f0bb034'); // Replace with your ImageBB API key
        formData.append('image', file);

        try {
            const response = await axios.post('https://api.imgbb.com/1/upload?key=abe0afd820806e4f1eb0a17d1f0bb034', formData);
            const { data: { data: { url } } } = response;
            setAvatarURL(url);
        } catch (error) {
            console.error('Error uploading avatar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Avatar Upload Failed',
                text: 'Failed to upload avatar. Please try again.',
            });
        }
    };

    const onSubmit = data => {
        if (data.password === data.confirmPassword) {
            createUser(data.email, data.password)
                .then(result => {
                    const loggedUser = result.user;
                    updateUserProfile(data.name, avatarURL) // Pass avatarURL to updateUserProfile
                        .then(() => {
                            const userInfo = {
                                name: data.name,
                                email: data.email,
                                district: data.district,
                                upazila: data.upazila,
                                photoURL: avatarURL, // Pass avatarURL to userInfo
                                bloodGroup: data.bloodGroup,
                                password: data.password,
                                role: "donor"
                            };
                            axiosPublic.post('/users', userInfo)
                                .then(res => {
                                    if (res.data.insertedId) {
                                        reset();
                                        Swal.fire({
                                            position: 'top-end',
                                            icon: 'success',
                                            title: 'User created successfully.',
                                            showConfirmButton: false,
                                            timer: 1500
                                        });
                                        navigate('/');
                                    }
                                })
                                .catch(error => console.log(error));
                        })
                        .catch(error => console.log(error));
                })
                .catch(error => console.error(error));
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Passwords do not match',
                text: 'Please ensure both passwords match.'
            });
        }
    };

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then(result => {
                const userInfo = {
                    email: result.user?.email,
                    name: result.user?.displayName
                };
                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        if (res.data.success) {
                            Swal.fire({
                                title: "User Logged In Successfully",
                                icon: "success"
                            });
                            navigate(location?.state ? location.state : '/');
                        }
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <>
            <Helmet>
                <title>Blood | Sign Up</title>
            </Helmet>
            <div className="p-12 min-h-screen bg-base-200">
                <div className="">
                    <div className="text-center lg:text-left mt-12 mb-8">
                        <h1 className="text-5xl font-bold">Register now!</h1>
                    </div>
                    <div className="card lg:card-side shadow-2xl bg-base-100">
                        <div className="lg:w-[52%] lg:h-[60%]">
                            {/* Placeholder for image */}
                            <img className="w-full h-96 lg:h-[480px]" src={pic1} alt="Profile" />
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input type="text" {...register("name", { required: true })} name="name" placeholder="Name" className="input input-bordered" />
                                {errors.name && <span className="text-red-600">Name is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Blood Group</span>
                                </label>
                                <select {...register("bloodGroup", { required: true })} className="select select-bordered">
                                    <option value="">Select blood group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                                {errors.bloodGroup && <span className="text-red-600">Blood group is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">District</span>
                                </label>
                                <select {...register("district", { required: true })} className="select select-bordered">
                                    <option value="">Select district</option>
                                    {districtOptions.map((district, index) => (
                                        <option key={index} value={district}>{district}</option>
                                    ))}
                                </select>
                                {errors.district && <span className="text-red-600">District is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Upazila</span>
                                </label>
                                <select {...register("upazila", { required: true })} className="select select-bordered">
                                    <option value="">Select upazila</option>
                                    {upazilaOptions.map((upazila, index) => (
                                        <option key={index} value={upazila}>{upazila}</option>
                                    ))}
                                </select>
                                {errors.upazila && <span className="text-red-600">Upazila is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="email" {...register("email", { required: true })} name="email" placeholder="email" className="input input-bordered" />
                                {errors.email && <span className="text-red-600">Email is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input type="password" {...register("password", {
                                    required: true,
                                    minLength: 6,
                                    maxLength: 20,
                                    pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/
                                })} placeholder="password" className="input input-bordered" />
                                {errors.password?.type === 'required' && <p className="text-red-600">Password is required</p>}
                                {errors.password?.type === 'minLength' && <p className="text-red-600">Password must be 6 characters</p>}
                                {errors.password?.type === 'maxLength' && <p className="text-red-600">Password must be less than 20 characters</p>}
                                {errors.password?.type === 'pattern' && <p className="text-red-600">Password must have one Uppercase one lower case, one number and one special character.</p>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Confirm Password</span>
                                </label>
                                <input type="password" {...register("confirmPassword", {
                                    required: true,
                                    minLength: 6,
                                    maxLength: 20,
                                    pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/
                                })} placeholder="confirmPassword" className="input input-bordered" />
                                {errors.password?.type === 'required' && <p className="text-red-600">Password is required</p>}
                                {errors.password?.type === 'minLength' && <p className="text-red-600">Password must be 6 characters</p>}
                                {errors.password?.type === 'maxLength' && <p className="text-red-600">Password must be less than 20 characters</p>}
                                {errors.password?.type === 'pattern' && <p className="text-red-600">Password must have one Uppercase one lower case, one number and one special character.</p>}
                            </div>
                            <div className="form-control mt-4">
                                <label className="label">
                                    <span className="label-text">Avatar</span>
                                </label>
                                <input type="file" onChange={handleAvatarUpload} accept="image/*" className="input input-bordered" />
                                {avatarURL && <p className="text-green-600 mt-1">Avatar uploaded successfully!</p>}
                            </div>
                            <div className="form-control mt-6">
                                <input className="btn btn-primary" type="submit" value="Sign Up" />
                            </div>
                            <div className="form-control">
                                <button onClick={handleGoogleSignIn} className="btn text-white bg-red-600">Google login</button>
                            </div>
                            <p className="pl-5">
                                Already have an account? <Link to='/login'> <button className="btn btn-link">LogIn</button></Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
