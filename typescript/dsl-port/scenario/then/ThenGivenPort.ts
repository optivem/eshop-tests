export interface ThenGivenStagePort {
    clock(): Promise<ThenGivenClockPort>;
    product(skuAlias: string): Promise<ThenGivenProductPort>;
    country(countryAlias: string): Promise<ThenGivenCountryPort>;
}

export interface ThenGivenClockPort {
    hasTime(time: string): ThenGivenClockPort;
    hasTime(): ThenGivenClockPort;
    clock(): Promise<ThenGivenClockPort>;
    product(skuAlias: string): Promise<ThenGivenProductPort>;
    country(countryAlias: string): Promise<ThenGivenCountryPort>;
}

export interface ThenGivenProductPort {
    hasSku(sku: string): ThenGivenProductPort;
    hasPrice(price: number): ThenGivenProductPort;
    clock(): Promise<ThenGivenClockPort>;
    product(skuAlias: string): Promise<ThenGivenProductPort>;
    country(countryAlias: string): Promise<ThenGivenCountryPort>;
}

export interface ThenGivenCountryPort {
    hasCountry(country: string): ThenGivenCountryPort;
    hasTaxRate(taxRate: number): ThenGivenCountryPort;
    hasTaxRateIsPositive(): ThenGivenCountryPort;
    clock(): Promise<ThenGivenClockPort>;
    product(skuAlias: string): Promise<ThenGivenProductPort>;
    country(countryAlias: string): Promise<ThenGivenCountryPort>;
}
