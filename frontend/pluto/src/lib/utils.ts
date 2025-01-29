import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function transformData(dataArray: any[]): any[] {
    return dataArray.reduce((acc: any[], curr: any) => {
        const existingTeam = acc.find((item: any) => item.name === curr.team_name);
        if (existingTeam) {
            existingTeam.values.push(curr.results);
        } else {
            acc.push({ name: curr.team_name, values: [curr.results] });
        }
        return acc;
    }, []);
}