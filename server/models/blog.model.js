import mongoose from 'mongoose';


const BlogSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


BlogSchema.statics = {
  list({ skip = 0, limit = 10 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  count() {
    return this.find()
      .exec();
  }
};

export default mongoose.model('Blog', BlogSchema);
