import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Correctly provided in the root injector
})
export class CountryService {
  private apiUrl = 'https://restcountries.com/v3.1';

  constructor(private http: HttpClient) {}

  // Fetch all countries
  getAllCountries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Fetch a specific country by its code (e.g., "GS" for South Georgia)
  getCountryByCode(code: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/alpha/${code}`);
  }
}