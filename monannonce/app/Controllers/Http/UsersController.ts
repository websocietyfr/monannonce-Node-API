import Application from '@ioc:Adonis/Core/Application'
import User from "App/Models/User";
import { DateTime } from 'luxon';

export default class UsersController {
    async getAll({response}) {
        const users = await User.all();
        return response.status(200).json(users);
    }

    async getMe({auth,response}) {
        const userId = auth.user.id;
        try {
            const user = await User.find(userId);
            if(user !== null) {
                return response.status(200).json(user);
            } else {
                return response.status(404).json({
                    error: 'User not found with id ' + userId
                });
            }
        } catch(e) {
            return response.status(400).json({
                status: 400,
                message: "Error on getting user",
                stack_trace: e.message
            });
        }
    }

    async getById({auth, params,response}) {
        const userId = params.id;
        if (auth.user.id !== userId){
            return response.status(403).json({
                error: 'This is not you...'
            });
        }
        try {
            const user = await User.find(userId);
            if(user !== null) {
                return response.status(200).json(user);
            } else {
                return response.status(404).json({
                    error: 'User not found with id ' + userId
                });
            }
        } catch(e) {
            return response.status(400).json({
                status: 400,
                message: "Error on getting user",
                stack_trace: e.message
            });
        }
    }

    async create({request,response}) {
        const payload = request.only(['firstname','lastname','email', 'password','address','zip_code','city','phone','country']);
        const identificalFile = request.file('identifical_file');
        const profilePicture = request.file('profile_picture');

        try{
            const user = new User();
            user.merge(payload);
            // move files
            if (identificalFile) {
                identificalFile.clientName = Date.now() + '-' + identificalFile.clientName
                await identificalFile.move(Application.tmpPath('uploads'));
                user.merge({
                    identifical_file: identificalFile.clientName
                })
            }
            if (profilePicture) {
                profilePicture.clientName = profilePicture.clientName + '-' + Date.now()
                await profilePicture.move(Application.tmpPath('uploads'));
                user.merge({
                    profile_picture: profilePicture.clientName
                })
            }
            await user.save();
            return response.status(201).json(user);
        } catch(e) {
            return response.status(400).json({
                status: 400,
                message: 'Error on user creation',
                stack_trace: e.message
            })
        }
    }

    async update({auth, params,request,response}) {
        const userId = params.id;
        if (auth.user.id !== userId){
            return response.status(403).json({
                error: 'This is not you...'
            });
        }
        const payload = request.only(['firstname','lastname','email', 'password','address','zip_code','city','phone','country']);
        const identificalFile = request.file('identifical_file');
        const profilePicture = request.file('profile_picture');
        const user = await User.find(userId);
        if(user != null){
            try{
                user.merge(payload);
                // move files
                if (identificalFile) {
                    identificalFile.clientName = Date.now() + '-' + identificalFile.clientName
                    await identificalFile.move(Application.tmpPath('uploads'));
                    user.merge({
                        identifical_file: identificalFile.clientName
                    })
                }
                if (profilePicture) {
                    profilePicture.clientName = profilePicture.clientName + '-' + Date.now()
                    await profilePicture.move(Application.tmpPath('uploads'));
                    user.merge({
                        profile_picture: profilePicture.clientName
                    })
                }
                await user.save();
                
                return response.status(200).json(user)
            } catch(e) {
                return response.status(400).json({
                    status: 400,
                    message: 'Error on user update',
                    stack_trace: e.message
                });
            }
        } else {
            return response.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }
    }

    async delete({auth, params,response}) {
        const userId = params.id;
        if (auth.user.id !== userId){
            return response.status(403).json({
                error: 'This is not you...'
            });
        }
        const user = await User.find(userId);
        if(user != null){
            try{
                await user.delete();
                return response.status(200).json({
                    status: "Deletion succeed"
                });
            } catch(e) {
                return response.status(400).json({
                    status: 400,
                    message: "An error occured on User deletion",
                    stack_trace: e.message
                });
            }
        } else {
            return response.status(404).json({
                status: 404,
                message: "User not found"
            });
        }

    }

    async publicProfil({params,response}) {
        const userId = params.id;
        try {
            const user = await User.find(userId);
            if(user !== null) {
                await user.load('offers', (postsQuery) => {
                    postsQuery.where('status_id', 2)
                  });
                return response.status(200).json({
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    profile_picture: user.profile_picture,
                    ...(user.offers.length ? { Offers: [
                        ...user.offers.map((offer) => {
                            return {
                                id: offer.id,
                                title: offer.title,
                                description: offer.description,
                                price: offer.price,
                                productPicture: offer.productPicture                            }
                        })
                    ] } : {})
                });
            } else {
                return response.status(404).json({
                    error: 'User not found with id ' + userId
                });
            }
        } catch(e) {
            return response.status(400).json({
                status: 400,
                message: "Error on getting user",
                stack_trace: e.message
            });
        }
    }
}
