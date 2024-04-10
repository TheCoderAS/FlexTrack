export interface DashboardCards {
    title:string;
    icon:string;
    bgColor:string;
    subtitle:string;
    footer:string;
}
export const dashboardCards:DashboardCards[]=[
    {
        title:"Exercise",
        icon:"fitness_center",
        bgColor:"purple-gradient",
        subtitle:"exercise.webp",
        footer:"4 days/week"
    },
    {
        title:"Meal",
        icon:"restaurant",
        bgColor:"red-gradient",
        subtitle:"meal.webp",
        footer:"2500-3000 kcal/day"
    },
    {
        title:"Sleep",
        icon:"hotel",
        bgColor:"pink-gradient",
        subtitle:"sleep.webp",
        footer:"6-7 hrs/day"
    },
    {
        title:"Water",
        icon:"local_drink",
        bgColor:"suns-gradient",
        subtitle:"water.webp",
        footer:"4-5 lit/day"
    }
]