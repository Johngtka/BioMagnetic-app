import { Service } from './Service';
import { Client } from './Client';
export interface Appointment {
    startDateTime: string;
    endDateTime: string;
    duration: number;
    service: Service;
    client: Client;
}
