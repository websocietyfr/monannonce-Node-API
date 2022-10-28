/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import User from 'App/Models/User';

// PUBLIC ROUTES
Route.post('/login', async ({ auth, request, response }) => {
  const email = request.input('email');
  const password = request.input('password');
  const token = await auth.use('api').attempt(email, password);
  console.log('token generated', token);
  return response.json({
    token
  })
})

Route.post('/registration', 'UsersController.create')
Route.get('/profile/:id', 'UsersController.publicProfil');
Route.get('/offer/:id', 'OffersController.publicOffer');
Route.get('/offer/user/:id', 'OffersController.publicOfferByUser');
Route.get('/offers-categories', ({response}) => {
  return response.status(200).json([
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
  ])
});
Route.post('/contact-author', 'ContactController.contactAuthor');
Route.get('/search', 'OffersController.search');

// AUTHENTICATED ROUTES
Route.group(() => {
  Route.get('/me', 'UsersController.getMe');
  Route.get('/all', 'UsersController.getAll');
  Route.get('/:id', 'UsersController.getById');
  Route.put('/:id', 'UsersController.update');
  Route.delete('/:id', 'UsersController.delete');
}).prefix('/user').middleware('auth');

Route.group(() => {
  Route.get('/my', 'OffersController.getMine');
  Route.get('/:id', 'OffersController.getById');
  Route.put('/:id', 'OffersController.update');
  Route.post('/', 'OffersController.create');
  Route.delete('/:id', 'OffersController.delete');
}).prefix('/admin_offer').middleware('auth');