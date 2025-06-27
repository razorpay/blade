// import {
//   Box,
//   Text,
//   Link,
//   Heading,
//   Card,
//   CardBody,
//   Scale,
// } from "../../../../../../components";
import { Box } from '../../../../../../components/Box';
import { Heading, Text } from '../../../../../../components/Typography';
import { Link } from '../../../../../../components/Link';
import { Card, CardBody } from '../../../../../../components/Card';
import { Scale } from '../../../../../../components/Scale';
import { useHistory } from "react-router-dom";

interface SettingLink {
  label: string;
  link: string;
}

interface SettingCardProps {
  title: string;
  description: string;
  links: SettingLink[];
  assetImage: string;
  path?: string;
}

const SettingCard = ({ title, description, links, assetImage, path }: SettingCardProps) => {
  const navigate = useHistory();

  const handleClick = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <Scale motionTriggers={["hover"]}>
    <Card 
      height="250px"
      isSelected={false}
      backgroundColor="surface.background.gray.intense"
      padding="spacing.0"
      borderRadius="medium"
      elevation="none"
      onClick={handleClick}      
      >
      <CardBody>
        <Box position="relative" height="250px" overflow="hidden" padding="spacing.7">
          <Box position="relative" zIndex="1">
            <Box display="flex" flexDirection="column" gap="spacing.5">
              <Box>
                <Heading
                  size="medium"
                  weight="semibold"
                  marginBottom="spacing.2"
                  color="surface.text.gray.normal"
                >
                  {title}
                </Heading>
                <Text weight="regular" color="surface.text.gray.muted">
                  {description}
                </Text>
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.4">
                {links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.link}
                    color="primary"
                    size="medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Box>
          </Box>
          <div
            style={{
              position: "absolute",
              right: "-100px",
              bottom: "-70px",
              width: "249px",
              height: "249px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at center, hsla(206, 93%, 95%, 0.9) 0%, hsla(206, 93%, 95%, 0.8) 20%, hsla(209, 95%, 97%, 0.6) 40%, hsla(209, 95%, 97%, 0.4) 60%, hsla(0, 0%, 100%, 0.2) 80%, hsla(0, 0%, 100%, 0) 100%)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingTop: "40px",
              overflow: "hidden",
            }}
          >
            <img 
              src={assetImage} 
              alt={`${title} illustration`}
              style={{
                width: "138px",
                height: "138px",
                objectFit: "contain",
                transform: "translateX(-30%)",
                marginBottom: "12px",
              }}
            />
          </div>
        </Box>
      </CardBody>
    </Card>
    </Scale>
  );
};

export default SettingCard;
