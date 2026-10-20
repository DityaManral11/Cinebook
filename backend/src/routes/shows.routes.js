import {Router} from 'express';import {listShows} from '../controllers/shows.controller.js';const r=Router();r.get('/',listShows);export default r;
