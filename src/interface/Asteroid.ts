export interface ApproachData {
  close_approach_date: string;
  miss_distance: {
    kilometers: string;
  }
}

export interface Asteroid {
  id: string;
  name: string;
  name_limited: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    meters: {
      estimated_diameter_max: number;
      estimated_diameter_min: number;
    }
  };
  close_approach_data: ApproachData[];
  nasa_jpl_url: string
}
