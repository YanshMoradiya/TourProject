import { Tour } from "../models/tourModel.js";
import { ApiFetures } from "../utils/apiFeatures.js";
import { ApiError } from "../utils/apiError.js";
import { catchAsync } from "../utils/catchAsync.js";


const getTopTours = (req, res, next) => {
    req.query.sort = 'ratingsAverage,price';
    req.query.limit = '5';
    req.query.fields = 'name,summary,price,difficulty,ratingsAverage,duration';
    next();
};

const getAllTours = catchAsync(async (req, res) => {
    const features = new ApiFetures(Tour.find(), req.query).filter().sort().limiteFields({ fields: '-isSecrete' }).paginate();
    const Tours = await features.query;
    res.status(200).json({ status: "success", data: { Tours } });
});


const creatNewTour = catchAsync(async (req, res) => {
    const newTour = await Tour.create(req.body);
    res.status(200).json({ status: "success", data: { newTour } });
});

const getTour = catchAsync(async (req, res, next) => {
    const features = new ApiFetures(Tour.findById(req.params._id), { fields: '-isSecrete,-__v' }).limiteFields();
    const tour = await features.query;
    if (!tour) {
        throw new ApiError('Tour of this id not found', 404);
    }
    res.status(200).json({ status: "success", data: { tour } });
});

const updateTour = catchAsync(async (req, res, next) => {
    const features = new ApiFetures(Tour.findByIdAndUpdate(req.params._id, req.body, {
        runValidators: true,
        new: true
    }), { fields: '-isSecrete,-__v' }).limiteFields();
    const updatedTour = await features.query;
    if (!updatedTour) {
        return next(new ApiError('Tour not found', 404));
    }
    res.status(200).json({ status: "success", data: { updatedTour } });
});

const deleteTour = catchAsync(async (req, res, next) => {
    const deltetedTour = new ApiFetures(Tour.findByIdAndDelete(req.params._id), req.query);
    const tour = await deltetedTour.query;
    if (!tour) {
        // console.log('call');
        return next(new ApiError('Tour not found', 404));
    }
    res.status(204).json({ status: "success", message: "successfully deleted!" });
});

const getTourStats = catchAsync(async (req, res, next) => {
    const tourStats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: {
                    $gt: 4.5
                }
            },
        },
        {
            $group: {
                _id: { $toUpper: "$difficulty" },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuntity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: {
                avgPrice: 1
            }
        }
    ]);
    if (!tourStats) {
        return next(new ApiError('data not found', 404));
    }
    res.status(200).json({ status: "success", data: { tourStats } });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(year, 0, 1),
                    $lte: new Date(year + 1, 0, 1)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numOfTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: { _id: 0 }
        },
        {
            $sort: {
                numOfTourStarts: -1
            }
        },
        {
            $limit: 2
        }
    ]);
    if (!plan) {
        return next(new ApiError('plan not found', 404));
    }
    res.status(200).json({ status: "success", data: { plan } });
});

const idCheck = (req, res, next) => {
    // if (req.params.id > tours.length) {
    //     return res.status(404).json({ status: 'fail', message: "Invalid id!" });
    // }
    // next();
};

const checkMiddleware = (req, res, next) => {
    // if (!req.body.name || !req.body.price) {
    //     return res.status(400).json({ status: 'failed', message: 'price and name is require...' });
    // }
    // next();
};

export { getTour, deleteTour, getAllTours, creatNewTour, updateTour, idCheck, checkMiddleware, getTopTours, getTourStats, getMonthlyPlan };