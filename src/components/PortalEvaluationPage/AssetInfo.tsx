import React from "react";
import {Carousel, Divider, Empty, Image as Img, Typography} from "antd";
import {getUrl} from "../../utils/utility";
import {configCarousel} from "../../pages/properties/[id]";

const {Title} = Typography

const AssetInfo: React.FC<{assetInfo: any}> = ({assetInfo}) => {
    return (
        <>
            <div className="flex justify-center">
                <Img
                    width={150}
                    src={getUrl(assetInfo?.avatar)}
                />
            </div>

            <br/>

            <Divider orientation="center" orientationMargin="0">Information</Divider>

            <Title level={5}>Address: {assetInfo?.address}</Title>
            <Title level={5}>description: {assetInfo?.description}</Title>
            <Title level={5}>External Url: {assetInfo?.externalUrl}</Title>
            <Title level={5}>Youtube Url: {assetInfo?.youtubeUrl}</Title>

            <Divider orientation="center" orientationMargin="0">Attributes</Divider>
            {(assetInfo?.attributes && assetInfo?.attributes.length) ? <table className='tbl' style={{width: '100%'}}>
                <tr>
                    <th>key</th>
                    <th>value</th>
                </tr>
                {assetInfo?.attributes.map((item: any, index: number) => (
                    <tr key={index}>
                        <td>{item.key}</td>
                        <td>{item.value}</td>
                    </tr>
                ))}
            </table> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
            <Divider orientation="center" orientationMargin="0">Product Images</Divider>
            <div className="rowSlide">
                <div className="slide">
                    {(assetInfo?.projectImages && assetInfo?.projectImages.length) ? <Carousel {...configCarousel}>
                        {assetInfo?.projectImages?.map((item: any, index: any) => {
                            return (
                                <img
                                    className="logo"
                                    src={getUrl(item)}
                                    style={{width: 100, height: 100}}
                                    key={index}
                                />
                            );
                        })}
                    </Carousel> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
                </div>
            </div>
            <br/>
            <Divider orientation="center" orientationMargin="0">Legal Paper</Divider>
            <div className="rowSlide">
                <div className="slide">
                    {(assetInfo?.certificates && assetInfo?.certificates.length) ? <Carousel {...configCarousel}>
                        {assetInfo?.certificates.map((item: any, index: any) => {
                            return (
                                <img
                                    className="logo"
                                    src={getUrl(item)}
                                    style={{width: 100, height: 100}}
                                    key={index}
                                />
                            );
                        })}
                    </Carousel> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
                </div>
            </div>
        </>
    )
}
export default AssetInfo
