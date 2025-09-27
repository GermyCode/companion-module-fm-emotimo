module.exports = {
  MOTOR_ID: [
    { id: 1, label: 'Pan' },
    { id: 2, label: 'Tilt' },
    { id: 3, label: 'M3' },
    { id: 4, label: 'M4' },
    { id: 5, label: 'TN1' },
    { id: 6, label: 'TN2' },
    { id: 7, label: 'TN3' },
    { id: 8, label: 'Roll' },
    { id: 9, label: 'Focus' },
  ],

  TN_MOTOR_ID: [
    { id: 5, label: 'TN 1' },
    { id: 6, label: 'TN 2' },
    { id: 7, label: 'TN 3' },
  ],

  DIRECTION_ID: [
    { id: 1, label: 'Positive' },
    { id: -1, label: 'Negative' },
  ],

  MOTOR_SPEED: [
    { id: 0, label: 'Default' },
    { id: 5000, label: 'Slow' },
    { id: 25000, label: 'Medium' },
    { id: 50000, label: 'Fast' },
    { id: 100000, label: 'Fastest' },

  ],

  MOTOR_PROFILES: [
    { id: 0, label: 'Quiet/Fast' },
    { id: 1, label: 'Quiet/Medium' },
    { id: 2, label: 'Quiet/Slow' },
    { id: 3, label: 'Timelapse' },
    { id: 4, label: 'Fastest' },
    { id: 5, label: 'User Defined 1' },
    { id: 6, label: 'User Defined 2' },
    { id: 7, label: 'Inertia Wheels' },
  ],

  MOTOR_PROFILES_VELOCITIES: [
    {id: 'Quiet/Fast,Pan', Vel: '90000', Accel: '2000', IRUN: '10', IHOLD: '3'},
    {id: 'Quiet/Fast,Tilt', Vel: '150000', Accel: '2000', IRUN: '10', IHOLD: '3'},
    {id: 'Quiet/Fast,M3', Vel: '130000', Accel: '850', IRUN: '20', IHOLD: '10'},
    {id: 'Quiet/Fast,M4', Vel: '75000', Accel: '2000', IRUN: '12', IHOLD: '1'},

    {id: 'Quiet/Medium,Pan', Vel: '55000', Accel: '1000', IRUN: '10', IHOLD: '3'},
    {id: 'Quiet/Medium,Tilt', Vel: '100000', Accel: '2000', IRUN: '10', IHOLD: '3'},
    {id: 'Quiet/Medium,M3', Vel: '50000', Accel: '650', IRUN: '20', IHOLD: '10'},
    {id: 'Quiet/Medium,M4', Vel: '75000', Accel: '2000', IRUN: '12', IHOLD: '1'},

    {id: 'Quiet/Slow,Pan', Vel: '40000', Accel: '750', IRUN: '10', IHOLD: '3'},
    {id: 'Quiet/Slow,Tilt', Vel: '75000', Accel: '750', IRUN: '10', IHOLD: '3'},
    {id: 'Quiet/Slow,M3', Vel: '20000', Accel: '400', IRUN: '20', IHOLD: '10'},
    {id: 'Quiet/Slow,M4', Vel: '75000', Accel: '2000', IRUN: '12', IHOLD: '1'},

    {id: 'Timelapse,Pan', Vel: '200000', Accel: '3000', IRUN: '8', IHOLD: '3'},
    {id: 'Timelapse,Tilt', Vel: '250000', Accel: '6000', IRUN: '10', IHOLD: '2'},
    {id: 'Timelapse,M3', Vel: '200000', Accel: '1500', IRUN: '20', IHOLD: '10'},
    {id: 'Timelapse,M4', Vel: '200000', Accel: '4000', IRUN: '13', IHOLD: '1'},

    {id: 'Fastest,Pan', Vel: '250000', Accel: '5000', IRUN: '8', IHOLD: '3'},
    {id: 'Fastest,Tilt', Vel: '300000', Accel: '8000', IRUN: '10', IHOLD: '2'},
    {id: 'Fastest,M3', Vel: '275000', Accel: '2250', IRUN: '20', IHOLD: '10'},
    {id: 'Fastest,M4', Vel: '200000', Accel: '4000', IRUN: '15', IHOLD: '2'},

    {id: 'User Defined 1,Pan', Vel: '', Accel: '', IRUN: '', IHOLD: ''},
    {id: 'User Defined 1,Tilt', Vel: '', Accel: '', IRUN: '', IHOLD: ''},
    {id: 'User Defined 1,M3', Vel: '', Accel: '', IRUN: '', IHOLD: ''},
    {id: 'User Defined 1,M4', Vel: '', Accel: '', IRUN: '', IHOLD: ''},

    {id: 'User Defined 1 Wheels,Pan', Vel: '', Accel: '', IRUN: '', IHOLD: ''},
    {id: 'User Defined 1 Wheels,Tilt', Vel: '', Accel: '', IRUN: '', IHOLD: ''},
    {id: 'User Defined 1 Wheels,M3', Vel: '', Accel: '', IRUN: '', IHOLD: ''},
    {id: 'User Defined 1 Wheels,M4', Vel: '', Accel: '', IRUN: '', IHOLD: ''},

    {id: 'Inertia Wheels,Pan', Vel: '400000', Accel: '60000', IRUN: '13', IHOLD: '4'},
    {id: 'Inertia Wheels,Tilt', Vel: '400000', Accel: '30000', IRUN: '12', IHOLD: '4'},
    {id: 'Inertia Wheels,M3', Vel: '250000', Accel: '2500', IRUN: '12', IHOLD: '4'},
    {id: 'Inertia Wheels,M4', Vel: '300000', Accel: '15000', IRUN: '10', IHOLD: '2'},
  ],

  PRESET_ID: [
    { id: 0, label: 'Pst0' },
  ],

  LOOP_ID: [
    { id: 0, label: 'Lp0' },
  ],

  VIRTUAL_BUTTON: [
    { id: 0, label: 'Enter' },
    { id: 1, label: 'Up' },
    { id: 2, label: 'Right' },
    { id: 3, label: 'Down' },
    { id: 4, label: 'Left' },
    { id: 5, label: 'Back' },
    { id: 6, label: 'Enter Held' },
    { id: 7, label: 'Triangle' },
    { id: 8, label: 'Circle' },
  ],

  DEFAULTS: [
    { id: 'RunT', value: 50},
    { id: 'RampT', value: 10},
    { id: 'PanPos', value: -2000000000},
    { id: 'TiltPos', value: -2000000000},
    { id: 'M3Pos', value: -2000000000},
    { id: 'M4Pos', value: -2000000000},
  ]
}