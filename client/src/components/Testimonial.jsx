import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets';
import{motion} from 'motion/react'

const Testimonial = () => {

    const testimonials = [
        { name: "Tony Stark", 
          location: "Banglore", 
          image: assets.testimonial_image_1, 
          testimonial: "“Booking was super quick and easy! Picked up my car in minutes and it was spotless. Will definitely rent again.”" 
        },
        { name: "Harry Potter", 
          location: "Nashik", 
          image: assets.testimonial_image_1,
          testimonial: "“I rented a Jeep Wrangler for a weekend trip and it was perfect — smooth drive, great mileage, and the interior felt brand new. The price per day was reasonable and there were no hidden charges.”" 
        },
        { name: "Jon Snow", 
          location: "Pune", 
          image: assets.testimonial_image_1, 
          testimonial: "“What I loved most was the customer support. They helped me find the right car for my trip and even guided me on the best pick-up location. 10/10 experience!”"
        }
    ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">

        <Title title="What Our Customers Say" subTitle="Discover why discerning travelers choose 
         StayVenture for their luxury accommodations around the world."/>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
            {testimonials.map((testimonial,index) => (
                <motion.div 
                initial = {{ opacity: 0, y:50}}
                whileInView = {{opacity:1, y:0}}
                transition={{duration: 0.6, delay: index * 0.2, ease:"easeOut"}}
                viewport={{once:true, amount:0.3}}
                 key={index} className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500">
                    <div className="flex items-center gap-3">
                        <img className="w-12 h-12 rounded-full" src={testimonial.image} 
                         alt={testimonial.name} />
                        
                        <div>
                            <p className="text-xl">{testimonial.name}</p>
                            <p className="text-gray-500">{testimonial.location}</p>
                        </div>
                    </div>
                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <img key={index} src={assets.star_icon} alt="star" />
                            ))}
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4 font-light">"{testimonial.testimonial}"</p>
                </motion.div>
            ))}
        </div>
    </div>
  )
}

export default Testimonial
