const axios=require('axios');

const apiVersion=process.env.API_VERSION || 1;
const baseUrl=`http://localhost:5000/v${apiVersion}/trips`;

async function searchTrips(start,end,date){
    try {
        const response=await axios.get(`${baseUrl}/search`,{
            params:{startDestination:start,endDestination:end,arriveTime:date},
        });

        console.log(`API Version: v${apiVersion}`);
        console.log(`Response: `,response.data);
        
    } catch (error) {
        console.error(`Error of calling v${apiVersion}: `,error.message);
        
    }
}

searchTrips("CMB","HMBT","2025-10-08T10:00:00")