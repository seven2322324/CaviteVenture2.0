// /models/AboutExplanation.ts
import mongoose from 'mongoose';

const AboutExplanationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ url: String, alt: String }],
});

const AboutExplanation = mongoose.models.AboutExplanation || mongoose.model('AboutExplanation', AboutExplanationSchema);

export default AboutExplanation;
