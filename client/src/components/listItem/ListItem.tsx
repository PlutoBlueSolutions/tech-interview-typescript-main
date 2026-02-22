import { type JSX } from "react";
import { vehicleKeys, type FilteredVehicles, type Vehicle } from "../../types/vehicles";
import './listItem.css';

interface Props {
    VehicleData: FilteredVehicles;
    level: number;
}

const ListItem: React.FC<Props> = ({ VehicleData, level }) => {
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

    return <>
        {(VehicleData.vehicles?.length ? VehicleData.vehicles : VehicleData.children).length ? <HeadingTag style={{ paddingLeft: `${(level * 15) + 10}px` }} className="table-header">{VehicleData.title}</HeadingTag> : <></>}
        {(VehicleData.vehicles || []).length ? <>
            <table>
                <thead>
                    <tr>
                        {
                            vehicleKeys.map((key: string) => {
                                return <th>{key.replace("_", " ")}</th>
                            })
                        }
                    </tr>
                </thead>

                <tbody>
                    {
                        (VehicleData.vehicles || []).map((vehicle: Vehicle, index: number) => {
                            return <tr key={`vehicle-${index}`}>{
                                vehicleKeys.map((key, ind) => {
                                    return <td key={`vehicle-${index}-${ind}`}>{vehicle[key]}</td>
                                })
                            }</tr>
                        })
                    }
                </tbody>
            </table>
        </> : <></>}
        {(VehicleData.children || []).map((child: FilteredVehicles) => {
            return <ListItem level={level + 1} VehicleData={child} />
        })}
    </>
}

export default ListItem;