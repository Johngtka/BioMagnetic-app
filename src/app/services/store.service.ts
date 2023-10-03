import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';

import { Store } from '../models/store';
import { environment } from '../../environments/environment';
import { SNACK_TYPE, SnackService } from './snack.service';

interface TotalStore {
    total: number;
}

@Injectable({
    providedIn: 'root',
})
export class StoreService implements OnDestroy {
    constructor(private http: HttpClient, private snackService: SnackService) {}

    apiURL = environment.API_URL;
    store = new BehaviorSubject<Array<Store>>([]);

    ngOnDestroy() {
        this.store.complete();
    }
    setStore(data: Store[]) {
        this.store.next(data);
    }

    getStore() {
        return this.store.asObservable();
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
                    'ERROR',
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
