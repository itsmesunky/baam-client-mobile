import styled from "@emotion/native";
import { Theme } from "../../styles/theme";
import { StackScreenProps } from "@react-navigation/stack";
import { SignUpStackParamList } from "../../navigations/SignUpStackNavigation";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import axios from "axios";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

type SchoolInfoFormProps = StackScreenProps<SignUpStackParamList, "SchoolInfoForm">;

type item = {
  grade: number;
  name: string[];
};
type DataType = {
  grade: number;
  names: string[];
};

export default function SchoolInfoForm({ navigation, route }: SchoolInfoFormProps) {
  const params = route.params;
  const id = params.schoolInfo.id;
  const name = params.schoolInfo.name;
  const roadNameAddress = params.schoolInfo.roadNameAddress;

  // 전체 데이터
  const [data, setData] = useState<DataType[] | null>(null);

  // 학년
  const [openGrade, setOpenGrade] = useState(false);
  const [grade, setGrade] = useState(null);
  const [gradeItems, setGradeItems] = useState<ItemType<string>[]>([]);

  // 학반
  const [openClass, setOpenClass] = useState(false);
  const [classValue, setClassValue] = useState(null);
  const [classItems, setClassItems] = useState<ItemType<string>[]>([]);

  const [active, setActive] = useState(false);

  // 학교별 학급 정보 조회 API
  useEffect(() => {
    async function fetchSchool() {
      const response = await axios.get(`https://b-site.site/school-dataset/classes/${id}`, {
        headers: {
          Accept: "application/json"
        }
      });

      const items = response.data.list;
      const grades = items.map((item: item) => {
        return {
          label: String(item.grade) + "학년",
          value: String(item.grade)
        };
      });
      setGradeItems(grades);
      setData(items);
    }
    fetchSchool();
  }, [id]);

  // 학년 선택에 따른 class dropdown 동적 변경
  function handleChangeClass() {
    setActive(false);
    setOpenClass(false);
    setClassValue(null);

    const idx = grade;

    if (data && idx !== null) {
      const nameArray = data[idx - 1].names;
      const sortedNames = nameArray.sort((a, b) => Number(a) - Number(b));
      const items = sortedNames.map((item: string) => ({
        label: item + "반",
        value: item
      }));
      setClassItems(items);
    }

    return;
  }

  return (
    <RootContainer>
      <InnerContainer>
        <StyledLabel>고등학교</StyledLabel>
        <Card>
          <SchoolName>{name}</SchoolName>
          <Address>{roadNameAddress}</Address>
        </Card>
      </InnerContainer>
      <InnerContainer>
        <StyledLabel>학년 반</StyledLabel>
        <DropDownRootContainer>
          <DropdownContainer>
            <DropDownPicker
              value={grade}
              open={openGrade}
              setOpen={setOpenGrade}
              setValue={setGrade}
              items={gradeItems}
              setItems={setGradeItems}
              placeholder="선택 필요"
              style={pickerStyle}
              closeAfterSelecting={true}
              dropDownContainerStyle={{
                borderColor: Theme.colors.Gray200,
                backgroundColor: Theme.colors.Gray200,
                position: "relative",
                top: 0,
                width: 156
              }}
              onChangeValue={handleChangeClass}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true
              }}
            />
          </DropdownContainer>
          <DropdownContainer>
            <DropDownPicker
              open={openClass}
              setOpen={setOpenClass}
              value={classValue}
              setValue={setClassValue}
              items={classItems}
              setItems={setClassItems}
              placeholder="선택 필요"
              style={pickerStyle}
              closeAfterSelecting={true}
              dropDownContainerStyle={{
                borderColor: Theme.colors.Gray200,
                backgroundColor: Theme.colors.Gray200,
                position: "relative",
                top: 0,
                width: 156
              }}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true
              }}
              onSelectItem={() => {
                setActive(true);
              }}
            />
          </DropdownContainer>
        </DropDownRootContainer>
      </InnerContainer>
      <ButtonContainer active={active}>
        <Pressable
          onPress={() => {
            navigation.navigate("UserNameForm");
          }}
        >
          <View>
            <ButtonText active={active}>다음</ButtonText>
          </View>
        </Pressable>
      </ButtonContainer>
    </RootContainer>
  );
}

const pickerStyle = {
  backgroundColor: Theme.colors.Gray100,
  borderColor: Theme.colors.Gray100,
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 12,
  width: 156,
  height: 42
};

const DropDownRootContainer = styled.View`
  flex-direction: row;
`;

const DropdownContainer = styled.View`
  flex: 1;
`;

const RootContainer = styled.SafeAreaView`
  display: flex;
  flex: 1;
  background-color: ${Theme.colors.White};
  padding: 27px 16px;
  gap: 32px;
`;

const InnerContainer = styled.View`
  background-color: ${Theme.colors.White};
  gap: 16px;
`;

const StyledLabel = styled.Text`
  ${Theme.typo.Label_02};
  color: ${Theme.colors.Black};
`;

const Card = styled.View`
  width: 100%;
  background-color: #f3f2ff;
  padding: 16px 12px 16px 12px;
  border-radius: 12px;
  gap: 8px;
  justify-content: center;
`;
const SchoolName = styled.Text`
  ${Theme.typo.Body_04_Bold};
  color: ${Theme.colors.Gray900};
`;

const Address = styled.Text`
  ${Theme.typo.Body_03_Regular};
  color: ${Theme.colors.Gray900};
`;

const ButtonText = styled.Text<{ active: boolean }>`
  ${Theme.typo.Label_03};
  text-align: center;
  color: ${({ active }) => (active ? Theme.colors.White : Theme.colors.Gray400)};
`;

const ButtonContainer = styled.View<{ active: boolean }>`
  width: 100%;
  position: absolute;
  left: 16px;
  bottom: 24px;
  height: 52px;
  padding: 16px 12px;
  border-radius: 24px;
  background-color: ${({ active }) => (active ? "#8A7EFF" : "#F3F2FF")};
`;
