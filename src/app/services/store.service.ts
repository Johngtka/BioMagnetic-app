import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Store } from '../models/store';
import { environment } from '../../environments/environment';
import { SNACK_TYPE, SnackService } from './snack.service';

interface TotalStore {
    total: number;
}

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
        this.getAllCountOfStore().subscribe({
            next: (all) => {
                const step = 40;
                const total = all.total;
                let store = [];
                for (let skip = 0; skip <= total; skip = skip + step) {
                    this.getStoreChunk(skip, step).subscribe({
                        next: (data) => {
                            store = [...store, ...data];
                            if (store.length === total) {
                                this.setStore(store);
                            }
                        },
                        error: (err) => {
                            this.snackService.showSnackBarMessage(
                                'ERROR.PATIENT_VISIT_CREATE_PATIENT',
                                SNACK_TYPE.error,
                            );
                            console.log(err.message);
                        },
                    });
                }
            },
            error: (err) => {
                this.snackService.showSnackBarMessage(
                    'provide here some message that make sense',
                    SNACK_TYPE.error,
                );
                console.log(err.message);
            },
        });
    }

    getStoreChunk(skip: number, limit: number): Observable<Array<Store>> {
        return this.http.get<Array<Store>>(
            this.apiURL + `/store?skip=${skip}&limit=${limit}`,
        );
    }
    getAllCountOfStore(): Observable<TotalStore> {
        return this.http.get<TotalStore>(this.apiURL + '/store/total');
    }
}
