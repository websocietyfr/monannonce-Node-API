import Offer from "App/Models/Offer";
import Application from '@ioc:Adonis/Core/Application'

export default class OffersController {
    async search({request, response}) {
        console.log('request query', request.requestData);
        if(request.requestData.key === undefined) {
            return response.status(400).json({
                status: 400,
                error: 'Search need key query param'
            })
        }
        if(request.requestData.category) {
            return response.status(200).json(await Offer.query().preload('status').whereIn('category', [ ...(request.requestData.category instanceof Array ? request.requestData.category : [ request.requestData.category ]) ]).whereLike('title', '%'+request.requestData.key+'%'));
        } else {
            return response.status(200).json(await Offer.query().preload('status').whereLike('title', '%'+request.requestData.key+'%'));
        }
    }

    async getMine({auth, response}) {
        const offers = await Offer.query().preload('status').where('user_id', auth.user.id);
        return response.status(200).json(offers);
    }

    async getById({auth, params,response}) {
        const offerId = params.id;
        try {
            const offer = await Offer.find(offerId);
            if(offer !== null) {
                if (auth.user.id !== offer.user_id){
                    return response.status(403).json({
                        error: 'This offer is not yours...'
                    });
                }
                await offer.load('status');
                await offer.load('user');
                return response.status(200).json(offer);
            } else {
                return response.status(404).json({
                    error: 'Offer not found with id ' + offerId
                });
            }
        } catch(e) {
            return response.status(400).json({
                status: 400,
                message: "Error on getting offer",
                stack_trace: e.message
            });
        }
    }

    async create({auth,request,response}) {
        const payload = request.only(['title', 'description', 'price', 'status_id', 'category']);
        const productPictureFile = request.file('productPicture');
        try{
            const offer = new Offer();
            if(!this._existsCategory(payload.category)) {
                return response.status(400).json({
                    status: 400,
                    message: 'The category selected is not exists'
                })
            }
            // move files
            if (productPictureFile) {
                productPictureFile.clientName = Date.now() + '-' + productPictureFile.clientName
                await productPictureFile.move(Application.tmpPath('uploads'));
                offer.merge({
                    productPicture: productPictureFile.clientName
                })
            }
            offer.merge(payload);
            await offer.related('user').associate(auth.user);
            await offer.save();
            return response.status(201).json(offer);
        } catch(e) {
            return response.status(400).json({
                status: 400,
                message: 'Error on offer creation',
                stack_trace: e.message
            })
        }
    }

    async update({auth, params,request,response}) {
        const offerId = params.id;
        const payload = request.only(['title', 'description', 'price', 'status_id', 'category']);
        const productPictureFile = request.file('productPicture');
        const offer = await Offer.find(offerId);
        if(offer != null){
            if (auth.user.id !== offer.user_id){
                return response.status(403).json({
                    error: 'This offer is not yours...'
                });
            }
            await offer.load('status');
            try{
                offer.merge(payload);
                if(payload.category && !this._existsCategory(payload.category)) {
                    return response.status(400).json({
                        status: 400,
                        message: 'The category selected is not exists'
                    })
                }
                // move files
                if (productPictureFile) {
                    productPictureFile.clientName = Date.now() + '-' + productPictureFile.clientName
                    await productPictureFile.move(Application.tmpPath('uploads'));
                    offer.merge({
                        productPicture: productPictureFile.clientName
                    })
                }
                await offer.save();
                
                return response.status(200).json(offer)
            } catch(e) {
                return response.status(400).json({
                    status: 400,
                    message: 'Error on offer update',
                    stack_trace: e.message
                });
            }
        } else {
            return response.status(404).json({
                status: 404,
                message: 'Offer not found'
            });
        }
    }

    async delete({auth, params,response}) {
        const userId = params.id;
        const offer = await Offer.find(userId);
        if(offer != null){
            if (auth.user.id !== offer.user_id){
                return response.status(403).json({
                    error: 'This offer is not yours...'
                });
            }
            try{
                await offer.delete();
                return response.status(200).json({
                    status: "Deletion succeed"
                });
            } catch(e) {
                return response.status(400).json({
                    status: 400,
                    message: "An error occured on Offer deletion",
                    stack_trace: e.message
                });
            }
        } else {
            return response.status(404).json({
                status: 404,
                message: "Offer not found"
            });
        }
    }

    //search
    async publicOffer({params,response}) {
        const offerId = params.id;
        try {
            const offer = await Offer.find(offerId);
            if(offer !== null) {
                await offer.load('user');
                await offer.load('status');
                return response.status(200).json({
                    id: offer.id,
                    title: offer.title,
                    description: offer.description,
                    price: offer.price,
                    productPicture: offer.productPicture,
                    category: offer.category,
                    ...(offer.user ? { Author: {
                        id: offer.user.id,
                        firstname: offer.user.firstname,
                        lastname: offer.user.lastname,
                        profile_picture: offer.user.profile_picture
                    }} :  {}),
                    ...(offer.status ? { Status: {
                        label: offer.status.label,
                    }} : {}),
                });
            } else {
                return response.status(404).json({
                    error: 'Offer not found with id ' + offerId
                });
            }
        } catch(e) {
            return response.status(400).json({
                status: 400,
                message: "Error on getting offer",
                stack_trace: e.message
            });
        }
    }

    // logged-in user offer's
    async publicOfferByUser({params,response}) {
        const userId = params.id;
        try {
            const offers = await Offer.query().preload('status').where({
                user_id: userId,
                status_id: 2
            });
            if(offers.length) {
                await offers.map(async (offer) => {
                    return {
                        id: offer.id,
                        title: offer.title,
                        description: offer.description,
                        price: offer.price,
                        productPicture: offer.productPicture,
                        category: offer.category,
                        ...(offer.status ? { Status: {
                            label: offer.status.label,
                        }} : {})
                    }
                })
                return response.status(200).json(offers);
            } else {
                return response.status(404).json({
                    error: 'No offers found for user id ' + userId
                });
            }
        } catch(e) {
            return response.status(400).json({
                status: 400,
                message: "Error on getting offers",
                stack_trace: e.message
            });
        }
    }

    _existsCategory(testedCategory: string) {
        const categories = [
            {
              label: 'Immobilier',
              machine_name: 'REAL_ESTATE'
            },
            {
              label: 'High-tech',
              machine_name: 'IT'
            },
            {
              label: 'Domotique',
              machine_name: 'AUTOMATION'
            },
            {
              label: 'Mobilier de maison',
              machine_name: 'HOME_FURNISHINGS'
            },
            {
              label: 'Autres mobilies',
              machine_name: 'OTHER_FURNITURE'
            },
            {
              label: 'Vêtements',
              machine_name: 'CLOTHES'
            },
            {
              label: 'Autres',
              machine_name: 'OTHERS'
            }
          ]
        return categories.filter(category => category.machine_name === testedCategory).length;
    }
}
