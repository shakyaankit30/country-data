import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService } from '../../service/country.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  countryList: any[] = []; // List of all countries
  selectedCountry: any = null; // Data for the selected country
  defaultCountryCode = 'IN'; // Default country code for India
  currentTime: string = ''; // Current time in the selected country
  private intervalId: any; // To store the interval ID for clearing it later
  countrySer = inject(CountryService);

  // Mapping of timezone offsets to IANA timezone names
  timezoneMap: { [key: string]: string } = {
    'UTC+05:30': 'Asia/Kolkata', // India
    'UTC-05:00': 'America/New_York', // USA (Eastern Time)
    'UTC+00:00': 'Europe/London', // UK
    'UTC+09:00': 'Asia/Tokyo', // Japan
    'UTC-04:00': 'America/Caracas', // Venezuela
    'UTC-03:00': 'America/Sao_Paulo', // Brazil (Brasília Time)
    'UTC-06:00': 'America/Chicago', // USA (Central Time)
    'UTC-07:00': 'America/Denver', // USA (Mountain Time)
    'UTC-08:00': 'America/Los_Angeles', // USA (Pacific Time)
    'UTC-09:00': 'America/Anchorage', // USA (Alaska Time)
    'UTC-10:00': 'Pacific/Honolulu', // USA (Hawaii-Aleutian Time)
    'UTC+01:00': 'Europe/Berlin', // Germany (Central European Time)
    'UTC+02:00': 'Africa/Cairo', // Egypt (Eastern European Time)
    'UTC+03:00': 'Europe/Moscow', // Russia (Moscow Time)
    'UTC+04:00': 'Asia/Dubai', // UAE (Gulf Standard Time)
    'UTC+06:00': 'Asia/Dhaka', // Bangladesh
    'UTC+07:00': 'Asia/Bangkok', // Thailand
    'UTC+08:00': 'Asia/Shanghai', // China
    'UTC+10:00': 'Australia/Sydney', // Australia (Eastern Time)
    'UTC+11:00': 'Pacific/Guadalcanal', // Solomon Islands
    'UTC+12:00': 'Pacific/Auckland', // New Zealand
    'UTC-03:30': 'America/St_Johns', // Canada (Newfoundland Time)
    'UTC-02:00': 'America/Noronha', // Brazil (Fernando de Noronha Time)
    'UTC-01:00': 'Atlantic/Cape_Verde', // Cape Verde
    'UTC+03:30': 'Asia/Tehran', // Iran
    'UTC+04:30': 'Asia/Kabul', // Afghanistan
    'UTC+05:00': 'Asia/Karachi', // Pakistan
    'UTC+05:45': 'Asia/Kathmandu', // Nepal
    'UTC+06:30': 'Asia/Yangon', // Myanmar
    'UTC+08:45': 'Australia/Eucla', // Australia (Central Western Time)
    'UTC+09:30': 'Australia/Adelaide', // Australia (Central Time)
    'UTC+10:30': 'Australia/Lord_Howe', // Australia (Lord Howe Time)
    'UTC+12:45': 'Pacific/Chatham', // New Zealand (Chatham Islands)
    'UTC+13:00': 'Pacific/Apia', // Samoa
    'UTC+14:00': 'Pacific/Kiritimati', // Kiribati (Line Islands)
    'UTC-11:00': 'Pacific/Midway', // USA (Midway Islands)
    'UTC-12:00': 'Pacific/Wake', // USA (Wake Island)
  };

  ngOnInit(): void {
    this.getCountryList();
    this.fetchDefaultCountry(); // Fetch India's data on page load
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    this.clearInterval();
  }

  // Fetch the list of all countries
  getCountryList() {
    this.countrySer.getAllCountries().subscribe({
      next: (response: any) => {
        this.countryList = response;
      },
      error: (error) => {
        console.error('Error fetching countries:', error);
      },
    });
  }

  // Fetch data for the default country (India)
  fetchDefaultCountry() {
    this.countrySer.getCountryByCode(this.defaultCountryCode).subscribe({
      next: (response: any) => {
        this.selectedCountry = response[0];
        this.updateCurrentTime(); // Update the current time for the default country
      },
      error: (error) => {
        console.error('Error fetching default country:', error);
      },
    });
  }

  // Fetch data for the selected country
  onCountrySelect(event: Event) {
    const selectedCode = (event.target as HTMLSelectElement).value; // Get the selected country code
    if (selectedCode) {
      this.countrySer.getCountryByCode(selectedCode).subscribe({
        next: (response: any) => {
          this.selectedCountry = response[0]; // Assuming the API returns an array with one country
          this.updateCurrentTime(); // Update the current time for the selected country
        },
        error: (error) => {
          console.error('Error fetching selected country:', error);
        },
      });
    } else {
      this.selectedCountry = null; // Reset if no country is selected
    }
  }

  // Update the current time for the selected country
  updateCurrentTime() {
    // Clear the previous interval if it exists
    this.clearInterval();

    if (this.selectedCountry && this.selectedCountry.timezones) {
      const timezoneOffset = this.selectedCountry.timezones[0]; // Get the first timezone offset
      const ianaTimezone = this.timezoneMap[timezoneOffset]; // Get the corresponding IANA timezone

      if (ianaTimezone) {
        // Function to format the time in HH:MM:SS AM/PM format
        const formatTime = () => {
          const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: ianaTimezone, // Use the IANA timezone
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true, // Use 12-hour format with AM/PM
          });
          this.currentTime = formatter.format(new Date());
        };

        // Update the time immediately
        formatTime();

        // Update the time every second
        this.intervalId = setInterval(formatTime, 1000);
      } else {
        this.currentTime = 'Timezone not supported'; // Handle unmapped timezones
      }
    } else {
      this.currentTime = ''; // Reset if no timezone is available
    }
  }

  // Clear the interval
  clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}