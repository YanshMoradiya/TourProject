import mongoose, { Schema } from "mongoose";
// import { isAlph } from 'validator'

const TourSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is not specified.'],
        unique: [true, 'Name is unique.'],
        trim: true,
        maxlength: [40, 'A tour must have at least 40 or less then characters.'],
        minlength: [10, 'A tour must have at least 4 or more then characters.'],
        // validate: [isAlph, 'Tour name must be only contain alphabetic characters.']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'Duration is not specified.'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'Max group size is not specified.'],
    },
    isSecrete: {
        type: Boolean,
        default: false
    },
    difficulty: {
        type: String,
        required: [true, 'Difficulty is not specified.'],
        enum: {
            values: ['Easy', 'Hard', 'Medium'],
            message: 'difficulty is either:easy,medium and hard.'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Reting must be greater than 1'],
        max: [5, 'Reting must be less than 5']
    },
    ratingsQuntity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Duplication of name is not allowed.'],
    },
    priceDiscount: {
        type: Number,
        validate: function (value) {
            return value < this.price;
        },
        message: 'Discount should be less than price.'
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'summary is not specified.'],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, 'imageCover is not specified.'],
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    startDates: [Date],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

TourSchema.virtual('durationInWeek').get(function () {
    return Number(String(this.duration / 7).slice(0, 4));
});

TourSchema.pre('save', function (next) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    next();
});

TourSchema.pre(/^find/, function (next) {
    this.find({ isSecrete: { $ne: true } });
    next();
});

TourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: {
            isSecrete: {
                $ne: true,
            }
        }
    });
    next();
});

// TourSchema.post('distinct', function (next) {
//     // this.aggregate([
//     //     {
//     //         $unset: '$isSecrete'
//     //     }

//     // ]);
//     next();
// });

// await TourSchema.pr([
//     {
//         $unset: 'isSecrete',
//     }
// ]);


const Tour = mongoose.model('Tour', TourSchema);

export { Tour };