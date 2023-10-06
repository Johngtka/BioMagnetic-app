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
    tempStore = [];
    ngOnDestroy() {
        this.store.complete();
    }
    setStore(data: Store[]) {
        this.store.next(data);
    }

    getStore() {
        return this.store.asObservable();
    }

    fetchStoreTotal() {
        this.getAllCountOfStore().subscribe({
            next: (all) => {
                this.fetchStore(0, 10, all.total);
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

    fetchStore(skip: number, step: number, total: number) {
        this.getStoreChunk(skip, step).subscribe({
            next: (data) => {
                this.tempStore = [...this.tempStore, ...data];
                if (this.tempStore.length === total) {
                    this.setStore(this.tempStore);
                } else {
                    this.fetchStore(skip + step, step, total);
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

    getStoreChunk(skip: number, limit: number): Observable<Array<Store>> {
        return this.http.get<Array<Store>>(
            this.apiURL + `/store?skip=${skip}&limit=${limit}`,
        );
    }
    getAllCountOfStore(): Observable<TotalStore> {
        return this.http.get<TotalStore>(this.apiURL + '/store/total');
    }
}
