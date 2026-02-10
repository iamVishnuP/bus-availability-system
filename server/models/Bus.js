import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
    state: {
        type: String,
        default: 'Kerala'
    },
    district: {
        type: String,
        required: true,
        enum: [
            'Thiruvananthapuram',
            'Kollam',
            'Pathanamthitta',
            'Alappuzha',
            'Kottayam',
            'Idukki',
            'Ernakulam',
            'Thrissur',
            'Palakkad',
            'Malappuram',
            'Kozhikode',
            'Wayanad',
            'Kannur',
            'Kasaragod'
        ]
    },
    busName: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    sourceTime: {
        type: String,
        required: true
    },
    destinationTime: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    stops: [{
        name: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        ticketPrice: {
            type: Number,
            required: true,
            default: 0
        }
    }],
    busType: {
        type: String,
        required: true,
        enum: ['Normal', 'Limited Stop', 'KSRTC']
    }
}, {
    timestamps: true
});

export default mongoose.model('Bus', busSchema);
