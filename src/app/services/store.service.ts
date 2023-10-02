import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Store } from '../models/store';
import { environment } from '../../environments/environment';
import { SNACK_TYPE, SnackService } from './snack.service';

@Injectable({
    providedIn: 'root',
})
export class StoreService {
    constructor(private http: HttpClient, private snackService: SnackService) {}
    store: Store[];

    apiURL = environment.API_URL;

    setStore(data: Store[]) {
        this.store = data;
    }

    getStore() {
        return this.store;
    }

    fetchStore() {
        // add logic here to loop to get all that is in the store
        // not only the 50 as we have it now

        // you need to know the total that is
        // you need to loop until the end
        // once you are at the end you can call this.setStore()
        this.getStoreChunk(0, 35).subscribe(
            (data) => this.setStore(data),
            (err) => {
                this.snackService.showSnackBarMessage(
                    'ERROR.PATIENT_VISIT_CREATE_PATIENT',
                    SNACK_TYPE.error,
                );
                console.log(err.message);
            },
        );
    }

    getStoreChunk(skip: number, limit: number): Observable<Array<Store>> {
        return this.http.get<Array<Store>>(
            this.apiURL + `/store?skip=${skip}&limit=${limit}`,
        );
    }
}
