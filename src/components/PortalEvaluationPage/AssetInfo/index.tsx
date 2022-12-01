import React, { useMemo } from "react";
import { Descriptions, Divider, Empty } from "antd";
import { getEmbedUrlYoutube, getUrl } from "../../../utils/utility";
import CarouselCustom from "../../common/CarouselCustom";

const AssetInfo: React.FC<{ assetInfo: any }> = ({ assetInfo }) => {
  if (!assetInfo) return <></>;
  const { projectImages, avatar } = assetInfo;

  const imageUrls = useMemo(
    () => projectImages.map((item: any) => getUrl(item)),
    [projectImages]
  );

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${getUrl(avatar)})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "400px",
        }}
      ></div>
      <br />

      <Divider orientation="center" orientationMargin="0">
        Information
      </Divider>
      <Descriptions column={1} colon={false} bordered={true}>
        <Descriptions.Item
          label={<span className="description-label">Address</span>}
        >
          <span className="description-value">{assetInfo?.address}</span>
        </Descriptions.Item>
        <Descriptions.Item
          label={<span className="description-label">Description</span>}
        >
          <span className="description-value">{assetInfo?.description}</span>
        </Descriptions.Item>
        <Descriptions.Item
          label={<span className="description-label">External Url</span>}
        >
          <a
            className="description-value"
            rel="noreferrer"
            href={assetInfo?.externalUrl}
            target="_blank"
          >
            {assetInfo?.externalUrl}
          </a>
        </Descriptions.Item>
        <Descriptions.Item
          label={<span className="description-label">Youtube Url</span>}
        >
          <a
            className="description-value"
            rel="noreferrer"
            href={assetInfo?.youtubeUrl}
            target="_blank"
          >
            {assetInfo?.youtubeUrl}
          </a>
        </Descriptions.Item>
      </Descriptions>
      <div style={{ margin: "10px 0px 40px" }}>
        <iframe
          width="100%"
          height="315"
          src={`//www.youtube.com/embed/${getEmbedUrlYoutube(
            assetInfo?.youtubeUrl
          )}`}
        ></iframe>
      </div>

      <Divider orientation="center" orientationMargin="0">
        Attributes
      </Divider>

      {assetInfo?.attributes && assetInfo?.attributes.length ? (
        <Descriptions column={1} colon={false} bordered={true}>
          {assetInfo?.attributes.map((item: any, index: number) => (
            <Descriptions.Item
              label={<span className="description-label">{item.key}</span>}
              key={index}
            >
              <span className="description-value">{item.value}</span>
            </Descriptions.Item>
          ))}
        </Descriptions>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}

      <Divider
        orientation="center"
        orientationMargin="0"
        style={{ marginTop: 40 }}
      >
        Land Images
      </Divider>
      {projectImages ? (
        <CarouselCustom urls={imageUrls} />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      <Divider
        orientation="center"
        orientationMargin="0"
        style={{ marginTop: 40 }}
      >
        Legal Paper
      </Divider>
    </>
  );
};
export default AssetInfo;