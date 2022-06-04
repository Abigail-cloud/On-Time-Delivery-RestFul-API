export const getUserList = () => {
    return [{
            id: 1,
            publicDelivery: true,
            name: 'user1',
            parcel: [{
                    name: 'parcel1',
                    amount: 1,
                    parcelId: 5,
                },
                {
                    name: 'parcel2',
                    amount: 400,
                    parcelId: 7,
                },
                {
                    name: 'parcel3',
                    amount: 70,
                    parcelId: 10,
                },
                {
                    name: 'parcel4',
                    amount: 600,
                    parcelId: 13,
                },
            ],
        },
        {
            id: 2,
            publicDeliver: true,
            name: 'user2',
            parcel: [{
                    name: 'parcel1',
                    amount: 14,
                    parcelId: 1,
                },
                {
                    name: 'parcel2',
                    amount: 400,
                    parcelId: 62,
                },
                {
                    name: 'parcel3',
                    amount: 250,
                    parcelId: 7,
                },
                {
                    name: 'parcel2',
                    amount: 700,
                    parcelId: 23,
                },
            ],
        },
    ];
}